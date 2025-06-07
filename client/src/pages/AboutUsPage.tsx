import { useLanguage } from "@/hooks/useLanguage";

const AboutUsPage = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">About USA Home</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg">
            USA Home is dedicated to connecting homeowners and property developers with qualified professionals 
            across all stages of home building, design, and financing. Our platform simplifies the process of 
            finding the right experts for your specific needs, ensuring quality service and peace of mind.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
          <p className="text-lg mb-4">
            Founded by industry experts with decades of combined experience in construction, design, and real estate, 
            USA Home understands the challenges of home building and renovation projects.
          </p>
          <p className="text-lg">
            Our team is committed to creating a seamless experience for both homeowners seeking services and 
            professionals looking to grow their business. We believe in fostering trusted connections that lead 
            to successful projects and beautiful homes.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
          <p className="text-lg mb-4">
            We carefully vet all professionals on our platform to ensure they meet our high standards of quality, 
            reliability, and customer service. Our multilingual support makes it easier for professionals to 
            connect with clients in their preferred language.
          </p>
          <p className="text-lg">
            USA Home is more than just a directory—we're a comprehensive platform that handles the entire 
            process from finding the right professional to managing your project communications.
          </p>
        </section>
        
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-lg mb-4">
            Have questions or need assistance? We're here to help!
          </p>
          <p className="text-lg">
            <strong>Email:</strong> <a href="mailto:info@usahome.center" className="text-blue-600 hover:underline">info@usahome.center</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;