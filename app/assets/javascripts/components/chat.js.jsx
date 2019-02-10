class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {comments: [], ongoing: []};
    this.updateMessage = this.updateMessage.bind(this);
    this.setupSubscription = this.setupSubscription.bind(this);
    this.speak = this.speak.bind(this);
  }

  componentDidMount() {
    this.setupSubscription()
  }

  updateMessage(comment) {
    if (comment.text) {
      this.setState({
        comments: this.state.comments.concat({
          id: comment.id, author: comment.author, text: comment.text
        }),
        ongoing: this.state.ongoing
      })
    } else if (comment.ongoing ) {
      if(this.state.ongoing.indexOf(comment.author) === - 1) {
        this.setState({
          comments: this.state.comments,
          ongoing: this.state.ongoing.concat([comment.author])
        })
      }
    } else if (comment.done) {
      let index = this.state.ongoing.indexOf(comment.author);
      const newOngoing = this.state.ongoing;
      if (index !== -1) {
        newOngoing.splice(index, 1);
      }
      this.setState({
        comments: this.state.comments,
        ongoing: newOngoing
      })
    }
  }

  setupSubscription() {
    this.appCable = App.cable.subscriptions.create('ChatChannel', {
      received: (comment) => {
        this.updateMessage(comment);
      },
    });
  }

  speak(comment) {
    this.appCable.perform('speak', comment);
  }

  render() {
    return (
      <div className='comments'>
        {this.state.comments.map((comment) => {
          return <p key={comment.id}><b>{comment.author}:</b>{comment.text}</p>
        })}
        <span className='ongoing-authors'>
          <p>{this.state.ongoing.join(',') + (this.state.ongoing.length > 0 ? ' typing...' : '')}</p>
        </span>
        <ChatCommentForm url={this.props.url} handleNotifyOngoing={this.speak} />
      </div>
    )
  }
}

class ChatCommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { inputOngoing: false };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onCommentSubmit = this.onCommentSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onCommentSubmit(comment)  {
    fetch(this.props.url, {
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

  handleChange(e) {
    e.preventDefault();
    let author = this.author.value.trim();
    let text = this.text.value.trim();
    if(!text)  {
      let comment = {author: author, done: true};
      this.props.handleNotifyOngoing(comment);
      this.state.inputOngoing = false;
      return;
    }
    if (!this.state.inputOngoing) {
      this.inputOngoing = true;
      let comment = {author: author, ongoing: true};
      this.props.handleNotifyOngoing(comment);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    let author = this.author.value.trim();
    let text = this.text.value.trim();
    if(!text || !author)  {
      return;
    }
    this.onCommentSubmit({author: author, text: text});
    this.inputOngoing = false;
    this.props.handleNotifyOngoing({author: author, done: true});
    this.text.value = '';
  }

  render() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit} onChange={this.handleChange}>
        <input type="text" placeholder="Your name" ref={(author) => { this.author = author; }}/>
        <input type="text" placeholder="Say something..." ref={(text) => { this.text = text; }} />
        <input type="submit" value="Post" />
      </form>
    );
  }
}