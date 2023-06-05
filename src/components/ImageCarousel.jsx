import React from 'react';
import store from "../store/Store";
import "../css/Slide.css"
import AliceCarousel from 'react-alice-carousel';


//CSS
import "react-alice-carousel/lib/alice-carousel.css";

const interval = 2000;

export default class ImageCarousel extends React.Component {
  constructor(props) {
		super(props);

		console.log("ImageCarousel props: ", this.props);
		console.log("Store:", store.getState());

		this.state = { activeItemIndex: 0,
      imgs: [], isLoading: true, showComicModal: false };
	}

  clickSlide = (comicID) => {
      console.log(comicID);
  }

handleSlideChange = (e) => {
  console.log("Slide changed: ", e.item);

  if(e.isNextSlideDisabled) {
    console.log("End of slides.");
    this.getSlides();
  }
}

  render() {
      var carousel = null;
      if(this.props.slides){
        carousel = <AliceCarousel
        items={this.props.slides}
        responsive={{
          0: { items: 1 },
          1024: { items: 5 },
          2200: { items: 10 },
        }}
        autoPlayInterval={interval}
        // autoPlayDirection="rtl"
        autoPlay={true}
        fadeOutAnimation={true}
        mouseTrackingEnabled={true}
        disableAutoPlayOnAction={true}
        infinite={true}
        keyboardNavigation={true}
        disableButtonsControls={true}
        // onSlideChanged={this.handleSlideChange}
        //animationType="fadeout"
        disableDotsControls={true}
      />
      }
    return (
      <div>
        {carousel}
      </div>
    );
  }
}
