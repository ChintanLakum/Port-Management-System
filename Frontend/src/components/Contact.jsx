import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useState } from 'react';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    const handleContact = async (e) => {
        e.preventDefault();
        try {
            console.log(formData)
            const response = await fetch("/api/user/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                console.log(response)
                const data = await response.json()
                toast.success(data.message)
                setFormData({ name: "", email: "", message: "", phone: "" });
            }
            else {
                const data = await response.json()
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }

    };
    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-base text-cyan-600 font-semibold tracking-wide uppercase">Get In Touch</h1>
                    <p className="mt-2 text-4xl leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none">
                        How Can We Help Your Port?
                    </p>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                        Whether you need a full system demo, technical support, or just have a question, our team is ready to connect.
                    </p>
                </div>

                {/* Main Content Grid (Contact Form + Contact Info) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* 1. Contact Form (Spans 2/3 columns) */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Send Us a Message</h2>

                        {/* Note: This is a static form structure. You would use state management (e.g., useState) 
                           and a backend API to handle the actual submission in a real application. */}
                        <form action="#" method="POST" className="space-y-6">

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" name="name" id="name" required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-3 border"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Work Email</label>
                                    <input type="email" name="email" id="email" required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-3 border"
                                        placeholder="port@example.com"
                                        value={formData.email}
                                    onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                                    <input type="tel" name="phone" id="phone"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-3 border"
                                        placeholder="+1 555 123 4567"
                                        value={formData.phone}
                                    onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                {/* <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                                <select name="subject" id="subject" required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-3 border bg-white"
                                >
                                    <option>Request a Demo</option>
                                    <option>Pricing Inquiry</option>
                                    <option>Technical Support</option>
                                    <option>Other</option>
                                     </select> */}
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea name="message" id="message" rows="4" required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-3 border"
                                    placeholder="Tell us about your port's needs..."
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleContact}
                                    type="submit"
                                    className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition duration-150"
                                >
                                    Send Message
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 text-right mt-2">
                                We aim to respond within **24 hours** on weekdays.
                            </p>
                        </form>
                    </div>

                    {/* 2. Contact Information (Spans 1/3 columns) */}
                    <div className="bg-cyan-700 p-8 rounded-xl shadow-2xl text-white space-y-8 h-fit">
                        <h2 className="text-2xl font-bold mb-4 border-b border-cyan-500 pb-3">Our Information</h2>

                        {/* Location */}
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <FaMapMarkerAlt className="text-xl text-cyan-300" />
                                <h3 className="text-lg font-semibold">Corporate Office</h3>
                            </div>
                            <address className="not-italic text-cyan-100 pl-8">
                                100 Maritime Plaza, Suite 200<br />
                                Global Port City, GP 12345
                            </address>
                        </div>

                        {/* Phone */}
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <FaPhone className="text-xl text-cyan-300" />
                                <h3 className="text-lg font-semibold">Call Us</h3>
                            </div>
                            <p className="text-cyan-100 pl-8">
                                Sales & General Inquiry: <a href="tel:+15551234567" className="underline hover:text-white block">+1 (555) 123-4567</a>
                                Support Line: <a href="tel:+15559876543" className="underline hover:text-white block">+1 (555) 987-6543</a>
                            </p>
                        </div>

                        {/* Email */}
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <FaEnvelope className="text-xl text-cyan-300" />
                                <h3 className="text-lg font-semibold">Email Us</h3>
                            </div>
                            <p className="text-cyan-100 pl-8 space-y-1">
                                <a href="mailto:info@portsync.com" className="underline hover:text-white block">info@portsync.com</a> (General)
                                <a href="mailto:support@portsync.com" className="underline hover:text-white block">support@portsync.com</a> (Technical)
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="pt-4 border-t border-cyan-600">
                            <h3 className="text-lg font-semibold mb-3">Connect</h3>
                            <div className="flex space-x-4">
                                <a href="https://linkedin.com/yourcompany" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-white transition duration-200">
                                    <FaLinkedin className="text-2xl" />
                                </a>
                                <a href="https://twitter.com/yourcompany" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-white transition duration-200">
                                    <FaTwitter className="text-2xl" />
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactUs;