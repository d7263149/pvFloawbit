const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white mt-16 py-[30px]" style={{padding: '80px 10px'}}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Footer Logo & Description */}
            <div>
              <img src="/images/logo.png" alt="Logo" className="h-10 w-auto mb-4" />
              <p className="text-gray-400">
                It is a long established fact that a reader will be distracted by the readable content of a page.
              </p>
            </div>
  
            {/* Community Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Community</h4>
              <ul>
                <li><a href="#" className="hover:underline">Become a Seller</a></li>
                <li><a href="#" className="hover:underline">Become a Buyer</a></li>
              </ul>
            </div>
  
            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
              <ul>
                <li>Address 1</li>
                <li>+012-99999999</li>
                <li>example@gmail.com</li>
              </ul>
            </div>
          </div>
  
          {/* Footer Bottom */}
          <div className="border-t border-gray-700 mt-8 pt-4 text-center">
            <p className="text-gray-500">&copy; 2024 All rights reserved | XYZ</p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  