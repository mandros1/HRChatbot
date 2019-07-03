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
// TODO: this is possibly way to simple so we might want to change this regex to a more complex one if there is a need for it
const LINK_REGEX = /^(ftp|http|https):\/\/[^ "]+$/;

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
    // @ts-ignore
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

    let containerClass = [(isUser ? 'userMessageContainer' : 'watsonMessageContainer')];
    let innerDivContainer = [(isUser ? 'userDivContainer' : 'watsonDivContainer')];

    let messageJson = {
      'tagName': 'div',
      'classNames': containerClass,
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
          'classNames': innerDivContainer,
          'children': [
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
            }
          ]
        }]
    };
    return Common.buildDomElement(messageJson);
  }

  /**
   * Used to scroll down to the bottom of the chat box and should be called anytime a
   * new message is appended to the chat window
   */
  public scrollToChatBottom() {
    let scrollingChat = document.querySelector('#scrollingChat');
    scrollingChat.scrollTop = scrollingChat.scrollHeight;
  }


  /**
   * Used to remove the 'latest' class from the last message from the user and watson
   * ex. if the user asks a new question, the latest class is removed from the previous question and is added to the new
   * question (same goes for watson messages)
   * @param text text received, either message from user or from watson
   * @param isUser boolean value that is used to recognize from whom is the latter text
   */
  public appendWatsonAnswer(text, isUser) {

    let chatBoxElement = document.querySelector(SETTINGS.selectors.chatBox);

    let previousLatest = chatBoxElement.querySelectorAll((isUser ? SETTINGS.selectors.fromUser : SETTINGS.selectors.fromWatson) +
      SETTINGS.selectors.latest);

    // Previous "latest" message is no longer the most recent
    if (previousLatest) {
      Common.listForEach(previousLatest, function (element) {
        element.classList.remove('latest');
      });
    }

    // TODO: figure out what is isTop meant to be used for, but for now hardcode it to true
    // This is hardcoded for now
    let isTop = true;

    this.setResponse(text, isUser, chatBoxElement, isTop);
  }


  /**
   * Used to get the ID of the video by slicing the provided youtube url and gathering last 11 letters of the link
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


  public setResponse(text, isUser, chatBoxElement, isTop) {


    // This part is for link recognition, only works if the message returns only the link itself
    // TODO: can be extended to recognize the link inside a wholesome text and put it in the anchor tags
    if(LINK_REGEX.test(text)) {
      // cut out the http/https/ftp prefix from the link
      let ix = text.indexOf('/')+2;
      let linkName = text.substring(ix, text.length);

      // cut out the sub sites and only keep the main url path
      // ex. 'https://stackoverflow.com/questions/1410311/something' goes into 'stackoverflow.com'
      ix = linkName.indexOf('/');
      linkName = linkName.substring(0, ix);

      // generate div with the provided link
      let chatElement = this.generateChatDivObject(`<a href="${text}">www.${linkName}</a>`, isUser, isTop);
      chatBoxElement.appendChild(chatElement);
      // scroll to the last message
      this.scrollToChatBottom();
    }

    // TODO: promijeniti WA tako da nema anchor tagova u odgovorima
    else if(!isUser && text !== null && text !== undefined && text !== '' && text.substring(0,2) === '<a'){
      // TODO: ovo se brise
      let ix = text.indexOf('>');
      let txt = text.substring(ix);
      txt = txt.substr(9, txt.length-13);

      // TODO: recognize if string contains a link


      // This recognizes a youtube link
      if(YOUTUBE_REGEX.test(txt)){
        let mainDiv = document.createElement('div');
        mainDiv.className += 'watsonMessageContainer';

        let videoId = this.getVideoId(txt);
        if (videoId !== 'error'){
            // TODO: create iframe and generate media window
        } else {
          // TODO: print out an element with a message?
          let errorParagraph = document.createElement('p');
          errorParagraph.style.color = 'red';
          errorParagraph.appendChild(document.createTextNode('Video je trenutačno nedostupan'));
        }
        let videoFrame = document.createElement( 'iframe');
        let url = "//www.youtube.com/embed/" + videoId;
        videoFrame.setAttribute("src", url);
        videoFrame.setAttribute("allowFullScreen", '');

        videoFrame.className += ' videoContainer';


        let messageContainer = document.createElement('div');
        messageContainer.className += ' messageContainer';


        let chatElement = this.generateChatDivObject(`Više informacija na temu možete pronaći ovdje:`, isUser, isTop);
        chatBoxElement.appendChild(chatElement);


        // In case we want to change the video frame to be embedded inside the watson chatbot dialog and not inside the chatbox like it is atm
          // let videoElementString = '<iframe class="videoContainer" src="//www.youtube.com/embed/' + videoId + '" frameborder="0" allow="fullscreen"></iframe>';
          // let videoElement = this.generateChatDivObject(videoElementString, isUser, isTop);
          // chatBoxElement.appendChild(videoElement);

        mainDiv.appendChild(videoFrame);

        chatBoxElement.appendChild(mainDiv);
        this.scrollToChatBottom();
      }
    } else {
        let chatElement = this.generateChatDivObject(text, isUser, isTop);
        chatBoxElement.appendChild(chatElement);
        this.scrollToChatBottom();
    }
  }


  /**
   * Used to activate event of sending the message when user presses 'enter' button (enter button = code 13)
   * @param event
   */
  public inputKeyDown(event) {
    let inputBox = document.getElementById('textInput');
    // @ts-ignore
    // Cheks if the pressed key is 'Enter' and if there is a text in the input
    if (event.keyCode === 13 && inputBox.value) {

      // @ts-ignore
      this.askQuestion(inputBox.value);
      inputBox.innerHTML = '';
      // @ts-ignore
      inputBox.value = '';
    }
  }

}
