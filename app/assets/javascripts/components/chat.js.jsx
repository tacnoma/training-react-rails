class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {comments: []};

    this.updateMessage = this.updateMessage.bind(this);
    this.setupSubscription = this.setupSubscription.bind(this);
  }

  componentDidMount() {
    this.setupSubscription()
  }

  updateMessage(comment) {
    this.setState({
      comments: this.state.comments.concat({
        author: comment.author, text: comment.text
      })
    })
  }

  setupSubscription() {
    App.cable.subscriptions.create('ChatChannel', {
      received: (comment) => {
        this.updateMessage(comment);
      },
    });
  }

  render() {
    return (
      <div className='comments'>
        {this.state.comments.map(function (comment, i) {
          return <p key={i}><b>{comment.author}:</b>{comment.text}</p>
        })}
        <ChatCommentForm url={this.props.url} />
      </div>
    )
  }
}

class ChatCommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onCommentSubmit = this.onCommentSubmit.bind(this);
  }

  onCommentSubmit(comment)  {
    fetch(this.props.url + '?from_chat=1', {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify(comment),
    })
      .then(
        (data) => {
        },
        (xhr, status, err) => {
          console.error(this.props.url, status, err.toString());
        }
      );
  }

  handleSubmit(e) {
    e.preventDefault();
    let author = this.author.value.trim();
    let text = this.text.value.trim();
    if(!text || !author)  {
      return;
    }
    this.onCommentSubmit({author: author, text: text});
    this.author.value = '';
    this.text.value = '';
  }

  render() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref={(author) => { this.author = author; }}/>
        <input type="text" placeholder="Say something..." ref={(text) => { this.text = text; }} />
        <input type="submit" value="Post" />
      </form>
    );
  }
}