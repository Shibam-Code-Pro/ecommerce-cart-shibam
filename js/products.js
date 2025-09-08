// Product data for the e-commerce cart
const products = [
    {
        id: 1,
        title: "Wireless Bluetooth Headphones",
        price: 79.99,
        image: "🎧",
        description: "High-quality wireless headphones with noise cancellation and 20-hour battery life."
    },
    {
        id: 2,
        title: "Smart Fitness Watch",
        price: 199.99,
        image: "⌚",
        description: "Track your fitness goals with GPS, heart rate monitor, and waterproof design."
    },
    {
        id: 3,
        title: "Portable Phone Charger",
        price: 29.99,
        image: "🔋",
        description: "10,000mAh power bank with fast charging and multiple USB ports."
    },
    {
        id: 4,
        title: "Wireless Gaming Mouse",
        price: 49.99,
        image: "🖱️",
        description: "Precision gaming mouse with RGB lighting and programmable buttons."
    },
    {
        id: 5,
        title: "Bluetooth Speaker",
        price: 89.99,
        image: "🔊",
        description: "Portable waterproof speaker with 360-degree sound and 12-hour battery."
    },
    {
        id: 6,
        title: "USB-C Hub Adapter",
        price: 39.99,
        image: "🔌",
        description: "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and PD charging."
    },
    {
        id: 7,
        title: "Wireless Phone Stand",
        price: 24.99,
        image: "📱",
        description: "Adjustable wireless charging stand compatible with all Qi-enabled devices."
    },
    {
        id: 8,
        title: "Mechanical Keyboard",
        price: 129.99,
        image: "⌨️",
        description: "RGB backlit mechanical keyboard with blue switches and aluminum frame."
    }
];

// Export products for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = products;
}
