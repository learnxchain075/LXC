import CommentsStyleWrapper from "./Comments.style";
import Data from "../../../assets/data/blog/comments";
import ReplyIcon from "../../../assets/images/icons/reply-icon.svg";
import ScrollAnimate from "../../../Components/ScrollAnimate";

const Comments = () => {
  return (
    <CommentsStyleWrapper>
      <ScrollAnimate>
        <div className="blog-comment-section">
          <h4>Comments</h4>
          {Data?.map((comment, i) => (
            <div key={i} className={comment.class}>
              <div className="blog-comment-block">
                <div className="comment-people-section">
                  <div className="comment-people-img">
                    <img src={comment.avatar} alt="avatar" />
                  </div>
                  <div className="comment-people-text">
                    <span className="author-name">{comment.author}</span>
                    <span className="blog-date">{comment.date}</span>
                  </div>
                </div>
                <div className="comment-content">
                  <p>{comment.text}</p>
                  <button>
                    <img src={ReplyIcon} alt="Reply" />
                    Reply
                  </button>
                </div>
              </div>

              {comment.replies?.map((replyItem, rid) => (
                <div key={rid} className="reply-comment-block">
                  <div className="blog-comment-block">
                    <div className="comment-people-section">
                      <div className="comment-people-img">
                        <img src={replyItem.avatar} alt="avatar" />
                      </div>
                      <div className="comment-people-text">
                        <span className="author-name">{replyItem.author}</span>
                        <span className="blog-date">{replyItem.date}</span>
                      </div>
                    </div>
                    <div className="comment-content">
                      <p>{replyItem.text}</p>
                      <button>
                        <img src={ReplyIcon} alt="Reply" />
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollAnimate>

      <ScrollAnimate>
        <div className="comment-writing-section">
          <h4>Leave a Comment</h4>
          <div className="comment-writing-form">
            <form>
              <div className="row">
                <div className="col-md-6">
                  <div className="comment-writing-input-section">
                    <label>Your Name *</label>
                    <input type="text" placeholder="e.g.  Roe Smith" autoComplete="off" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="comment-writing-input-section">
                    <label>Email Address *</label>
                    <input type="text" placeholder="e.g.  example@mail.com" autoComplete="off" />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="comment-writing-input-section">
                    <label>Website</label>
                    <input type="text" placeholder="e.g.  website.com" autoComplete="off" />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="comment-writing-input-section">
                    <label>Comment *</label>
                    <textarea placeholder="Type your comment"></textarea>
                  </div>
                </div>

                <div className="col-md-12">
                  <button className="template-btn primary-bg">
                    <span className="btn-inner">
                      <span className="btn-normal-text">Submit Comment</span>
                      <span className="btn-hover-text">Submit Comment</span>
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </ScrollAnimate>
    </CommentsStyleWrapper>
  );
};

export default Comments;
