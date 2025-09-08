const VideoHero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="https://cdn.midjourney.com/video/7819b5ec-35f8-413c-beb9-4fa5b926074a/0.mp4" type="video/mp4" />
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="glass-card p-8 md:p-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 text-glow">
            Visualize Climate Impact
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Upload your nature images and see how climate change affects our environment. 
            Learn through AI-powered visualizations that show both the challenges and solutions.
          </p>
          
          <div className="mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Start Your Climate Journey
            </h2>
            <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-6">
              Upload an image of nature and explore how climate change impacts our environment, 
              or discover solutions that can make a difference.
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
          <div className="glass w-6 h-10 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary-foreground/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoHero;