import React from "react";

const CarouselSlide = (props) => {
  const { id, slideTitle, slideDescription, slideBg } = props;
  return (
    <div className="slideWrap" style={{ backgroundImage: `url(${slideBg})` }}>
      <div className="textWrap">
        <h2>{slideTitle}</h2>
        <p>{slideDescription}</p>
        <a className="btn">Learn More</a>
      </div>
    </div>
  );
};

export default CarouselSlide;
