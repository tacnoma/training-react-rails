class CommentBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [{ text: '', author: '', id: 0 }] };
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.loadCommentsFromServer = this.loadCommentsFromServer.bind(this);
  }

  handleCommentSubmit(comment)  {
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
      .then(res =>  res.json())
      .then(
        (data) => {
          this.setState({data: [data].concat(this.state.data)});
        },
        (xhr, status, err) => {
          console.error(this.props.url, status, err.toString());
        }
      );
  }

  loadCommentsFromServer() {
    fetch(this.props.url)
      .then(res => res.json() )
      .then(
        (result) =>{
          this.setState({data: result.data});
        },
        (xhr, status, err) => {
          console.error(this.props.url, status, err.toString());
        }
      );
  }

  componentDidMount() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  }

  render() {
    return (
      <div className="CommentBox">
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        <h1>Comments</h1>
        <CommentList data={this.state.data}/>
      </div>
    );
  }
}

class CommentList extends React.Component {
  constructor(props) {
      super(props);
  }

  render() {
    let commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author} key={comment.id.toString()}>{comment.text}</Comment>
      );
    });
    return (
      <div className="commentList">
      {commentNodes}
      </div>
    );
  }
}

class Comment extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let children = this.props.children;
    let rawMarkup = children ? marked(children.toString(), {sanitize: true}) : '';
    return (
      <div className="comment">
      <h2 className="commentAuthor">
      {this.props.author}
      </h2>
      <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
}

class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    let author = this.author.value.trim();
    let text = this.text.value.trim();
    if(!text || !author)  {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
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
