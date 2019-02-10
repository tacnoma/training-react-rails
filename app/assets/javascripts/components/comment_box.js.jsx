class CommentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [{ Text: 'hola' }] };
    }

    handleCommentSubmit(comment)  {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: this.state.data.concat([data])});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  loadCommentsFromServer() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(result) {
        this.setState({data: result.data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  componentDidMount() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  }

  render() {
    return (
      <div className="CommentBox">
      <h1>Comments</h1>
      <CommentList data={this.state.data}/>
      <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
}

class CommentList extends React.Component {
  constructor(props) {
      super(props);
  }
  render() {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author}>{comment.text}</Comment>
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

    //var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    var rawMarkup = 'test';
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
    }
  handleSubmit(e) {
    e.preventDefault();
    var author = this.author.value.trim();
    var text = this.text.value.trim();
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
