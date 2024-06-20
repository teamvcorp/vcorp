import { Carousel } from "react-responsive-carousel";
import { banner } from "../data/matrix";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const AboutCarousel = () => {
  return (
    <>
      <Carousel showThumbs={false} autoPlay infiniteLoop>
        {banner.featuredProjects.map((project) => (
          <div key={project.id}>
            <img src={project.image} alt={project.title} />
          </div>
        ))}
      </Carousel>
    </>
  );
};

export default AboutCarousel;
