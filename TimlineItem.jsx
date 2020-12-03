import React from "react";
import PropTypes from "prop-types";

/**
 * @usage
 * <TimlineItem time={time} text={text} />
 */
function TimlineItem({ time, text,image }) {
  return (
    <li>
      <i className="fa" />
      <div className="time-line-item">
        <span className="time">
          <i className="fa fa-clock-o" />
          {time}
        </span>
        <div className="time-line-header">{text}</div>
        <div className="image">
                        <img height='300vmin' src={image} />
        </div>
      </div>
    </li>
  );
}

TimlineItem.defaultProps = {};

TimlineItem.propTypes = {
  time: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired
};

export default TimlineItem;
