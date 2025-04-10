export type MessageType = 'text' | 'button' | 'select' | 'input' | 'reservationView' | 'viewReservationList';

export interface ChatMessage {
  type: MessageType;
  content: string;
  options?: string[]; 
  delay?: number; 
  name?:string;
  column?:string[];
  option?:string[];
  reqType?:string[];
  state?:string;
}

// Use an index signature to define chatMessages as an object of multiple ChatMessage types
export const chatMessages: { [key: string]: ChatMessage } = {
  welcome: {
    type: 'button',    
    content: 'こんにちは!🙂<br/>私たちのサイトにお越しいただきありがとうございます。<br/>私は、Full Value社の予約管理エージェント、エミーです。<br/>予約の変更方法、その手続きについてご案内できます。<br/>どのようなお手伝いが必要でしょうか？',
    
    options: ['予約変更', '予約照会'],
    reqType: ['return']
  },
  welcomeAgain:{
    type: 'button',    
    content: '私はどのようにもっとお手伝いできますか？',
    options: ['予約変更', '予約照会'],
    reqType: ['return']
  },
  viewReservationListError:{
    type: 'button',    
    content: '予約内容はありません。予約を進めますか？',
    options: ['新しい予約',],
    reqType: ['return']
  },
  新しい予約: {
    type: 'input',
    content: 'マンション名を⼊⼒してください!<br>下の入力ウィンドウにメンション名を入力し、エンターガンを押してください。（メンション名のみを入力してください。）',
    reqType: ['findFlat']
  },
  予約照会: {
    type: 'input',
    content: 'マンション名を⼊⼒してください!<br>下の入力ウィンドウにメンション名を入力し、エンターガンを押してください。（メンション名のみを入力してください。）',
    reqType: ['findFlat']
  },
  予約変更: {
      type: 'input',
      content: 'マンション名を⼊⼒してください!<br>下の入力ウィンドウにメンション名を入力し、エンターガンを押してください。（メンション名のみを入力してください。）',
      reqType: ['findFlat']
  },
  inputFlatError: {
    type: 'input',
    content: '入力した内容と一致する不動産名はありません。もう一度入力してください。',
    reqType: ['findFlat']
  },
  selectFlatError: {
    type: 'input',
    content: '望むメンション名がない場合は再入力してください。',
    reqType: ['findFlat']
  },
  inputFlatSucess: {
    type: 'select',    
    content: '入力した内容と一致する不動産名は以下の通りです。次の中から正確な不動産を選択してください。',
    column:["name","address"],
    name:"selectedflat",
    reqType:["selectFlat","back"],      
    
  },
  selectWorkError: {
    type: 'input',
    content: '望む作業名がない場合は再入力してください。',
    reqType: ['findFlat']
  },
  inputRoomNum: {
    type: 'input',    
    content: '部屋番号を入力してください。部屋番号がない場合は、入力せずにエンターボタンを押してください。',
    reqType: ['inputRoomNum']
  },
  inputRoomNumError: {
    type: 'input',
    content: '部屋番号のみを正確に入力してください。',
    reqType: ['inputRoomNum']
  },
  findUpdateDateError:{
    type: 'button',    
    content: '予約可能な日付はありません。',
    options: ['戻る',],
    reqType: ['return']
  },
  inputRoomNumNullError: {
    type: 'input',
    content: '入力した部屋番号には作業がありません。別の部屋番号を入力してください',
    reqType: ['inputRoomNum']
  },
  inputRoomNumSucess_add: {
    type: 'select',
    content: '現在予約可能作業は下記です。',
    column:["work"],
    reqType: ['selectWork']
  },
  inputRoomNumSucess_edit: {
    type: 'select',
    content: '現在予約中の作業は下記です。',
    column:["work"],
    reqType: ['selectWork']
  },
  selectReservationDate:{
    type: 'select',
    content: '現在予約可能な日は下記です。',
    column:["ReserVationDate"],
    reqType: ['selectDivision']
  },
  selectDivision:{
    type: 'select',
    content: '予約可能区分は下記です。',
    options:["午前","午後","どちらでも"],
    name:"division",
    column:["s"],
    reqType: ['reservate']
  },
  bookedReservation:{
    type: 'reservationView',    
    content: '予約が実⾏されました。',        
    state:"OK",
    reqType: ['新しい予約','戻る']
  },
  inputBookedReservationNum:{
    type: 'input',
    content: 'すでに予約されている予約番号を記⼊してください。（予約番号のみを入力してください。）',
    reqType: ['viewReservation']
  },
  findReservationError:{
    type: 'button',    
    content: '該当の予約はありません。',
    options: ['予約変更', '予約照会'],
    reqType: ['return']
  },
  inputBookedReservationNumError: {
    type: 'input',
    content: '予約番号のみを入力してください。',
    reqType: ['viewReservation']
  },
  inputBookedReservationNumNullError: {
    type: 'input',
    content: '入力した番号の予約はありません。正確に入力してください。',
    reqType: ['viewReservation']
  },
  changeableReservation:{
    type: 'reservationView',    
    content: '現在予約中のメニューは下記です。<br> 予約を変更しますか？',        
    reqType: ['変更する','変更しない']
  },
  changeReservation:{
    type: 'reservationView',    
    content: '下記の既存の予約を削除して新規予約します。',        
    reqType: ['はい','いいえ']
  },
  ReservationChangeSucess:{
    type: 'reservationView',    
    content: 'ご予約の変更が完了しました>',        
    reqType: ['次へ','終了']
  },
  viewReservationList:{
    type: 'viewReservationList',    
    content: 'ご予約内容をこちらでご確認いただけます。',        
    reqType: ['次へ','終了']
  },  
  

};
