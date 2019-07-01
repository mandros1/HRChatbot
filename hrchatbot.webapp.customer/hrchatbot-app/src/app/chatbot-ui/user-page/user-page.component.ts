import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {RepositoryService} from "../../shared/repository.service";
import {Common} from './common';

const SETTINGS = {
  selectors: {
    chatBox: '#scrollingChat',
    fromUser: '.from-user',
    fromWatson: '.from-watson',
    latest: '.latest'
  },
  authorTypes: {
    user: 'user',
    watson: 'watson'
  }
};

const YOUTUBE_REGEX = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

@Component({
  selector: 'app-user-page',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit, AfterViewInit{


  constructor(private repoService: RepositoryService) {}

  ngOnInit() {
    sessionStorage.clear();
  }

  ngAfterViewInit(): void {
    this.repoService.getSessionId()
      .subscribe(res => {

        if(res.success){
          let keys = Object.keys(res.message);

          for(let i=0; i<keys.length; i++){
            this.appendWatsonAnswer(res.message[i], false);
          }
        }
      })
  }

  public askQuestion(text) {
    // let inputElement = document.getElementById('input');
    // @ts-ignore
    // let text = inputElement.value;
    console.log('Asked a question');
    // inputElement.innerText = '';
    this.appendWatsonAnswer(text, true);
    let body= {
      question: text
    };
    this.repoService.sendQuestion(body)
      .subscribe(res => {

        if(res.success){
          let keys = Object.keys(res.message);
          console.log(res.message);

          for(let i=0; i<keys.length; i++){
            this.appendWatsonAnswer(res.message[i], false);
          }
        }
      })
  }


  /**
   * returns an element that is built in the BuildDomElement function in the common.js class
   * @param text
   * @param isUser
   * @param isTop
   */
  public generateChatDivObject(text, isUser, isTop) {
    let classes = [(isUser ? 'userBox' : 'watsonBox'), 'latest', (isTop ? 'top' : 'sub'), (isUser ? 'userBubble' : 'watsonBubble')];
    let dateNow = new Date();
    let months = ['SIJ', 'VELJ', 'OZU', 'TRA', 'SVI', 'LIP', 'SRP', 'KOL', 'RUJ', 'LIS', 'STU', 'PRO'];
    let date = dateNow.getDate().toString().length > 1 ? dateNow.getDate() : ('0'+dateNow.getDate().toString());
    let minutes = dateNow.getMinutes().toString().length > 1 ? dateNow.getMinutes() : ('0'+dateNow.getMinutes().toString());
    let hour = dateNow.getHours().toString().length > 1 ? dateNow.getHours() : ('0'+dateNow.getHours().toString());
    let timestamp = date + ' ' + months[dateNow.getMonth()] + ' - ' + hour + ':' + minutes;
    let logoClass = [(isUser ? 'userLogo' : 'watsonLogo')];
    let logoText = [(isUser ? 'person' : 'adb')];
    let spanClass = [(isUser ? 'userMessage' : 'chatbotMessage')];
    let messageJson = {
      'tagName': 'div',
      'classNames': ['messageContainer'],
      'children': [{
        'tagName': 'div',
        'classNames': logoClass,
        'children': [{
          'tagName': 'i',
          'classNames': ['material-icons'],
          'text': logoText
        }]
      },
        {
          'tagName': 'div',
          'classNames': classes,
          'children': [{
            'tagName': 'p',
            'text': text
          }]
        },
        {
          'tagName': 'span',
          'id': 'textSpan',
          'children': [{
            'tagName': 'i',
            'classNames': ['material-icons', 'icon'],
            'text': 'access_time'
          }],
          'classNames': spanClass,
          'text': timestamp
        }]
    };
    return Common.buildDomElement(messageJson);
  }

  public appendWatsonAnswer(text, isUser) {
    // TODO: figure out what is isTop meant to be used for, but for now hardcode it to true

    let chatBoxElement = document.querySelector(SETTINGS.selectors.chatBox);

    let previousLatest = chatBoxElement.querySelectorAll((isUser ? SETTINGS.selectors.fromUser : SETTINGS.selectors.fromWatson) +
      SETTINGS.selectors.latest);

    // Previous "latest" message is no longer the most recent
    if (previousLatest) {
      Common.listForEach(previousLatest, function (element) {
        element.classList.remove('latest');
      });
    }

    // This is hardcoded for now
    let isTop = true;

    this.setResponse(text, isUser, chatBoxElement, isTop);
  }

  /**
   * Used to get the ID of the video by slicing the provided youtube url
   */
  public getVideoId(url) {
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);

    if (match && match[2].length == 11) {
      console.log(match[2]);
      return match[2];
    } else {
      return 'error';
    }
  }


  public generateEmbeddedVideo(url) {
    let videoId = this.getVideoId(url);

    let fullString = '<iframe width="560" height="315" src="//www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>';

    // let videoSrc = "//www.youtube.com/embed/" + videoId;
    //
    // let videoFrame = document.createElement('iframe');
    // videoFrame.className += " videoContainer";
    // videoFrame.setAttribute(frameborder, '0')
    //
    //

    return fullString;
  }


  public setResponse(text, isUser, chatBoxElement, isTop) {

    let rege = /youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/;
    // console.log(text);
    if(!isUser && text !== null && text !== undefined && text !== '' && text.substring(0,2) === '<a'){
      let ix = text.indexOf('>');
      let txt = text.substring(ix);
      txt = txt.substr(9, txt.length-4);
      console.log(txt);

      console.log(txt.match(rege));

      if(YOUTUBE_REGEX.test(txt)){
        // console.log('WE HAVE A YOUTUBE LINK BOSS');
        let mainDiv = document.createElement('div');
        mainDiv.className += 'messageContainer';

        let videoId = this.getVideoId('https://www.youtube.com/watch?v=SQwUtEpk8BY');
        let videoFrame = document.createElement('iframe');
        let url = "//www.youtube.com/embed/" + videoId;
        videoFrame.setAttribute("src", url);
        videoFrame.setAttribute("allow", "fullscreen");
        // videoFrame.setAttribute("allowfullscreen", "fullscreen");
        videoFrame.style.width = "640px";
        videoFrame.style.height = "480px";


        // let fullDomString = this.generateEmbeddedVideo(txt);
        // let doc = new DOMParser().parseFromString(fullDomString, 'text/xml');
        // mainDiv.appendChild(doc.documentElement);

        mainDiv.appendChild(videoFrame);

        let chatWindow = document.getElementById('scrollingChat');
        chatWindow.appendChild(mainDiv);
      }
    }



    let chatElement = this.generateChatDivObject(text, isUser, isTop);
    chatBoxElement.appendChild(chatElement);
  }


  public inputKeyDown(event) {
    let inputBox = document.getElementById('textInput');
    // @ts-ignore
    if (event.keyCode === 13 && inputBox.value) {

      // @ts-ignore
      this.askQuestion(inputBox.value);
      inputBox.innerHTML = '';
      // @ts-ignore
      inputBox.value = '';
    }
  }

}
