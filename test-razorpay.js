// Test script to verify Razorpay SDK works
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SG07Cuhs0hKyuC',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'Yxxej3MbcXNJkKuzvumBXdZp',
});

console.log('Razorpay instance created:', !!razorpay);
console.log('Razorpay orders API:', !!razorpay.orders);

// Try to create an order
razorpay.orders.create({
    amount: 50000,
    currency: 'INR',
    receipt: 'test_receipt_1',
})
    .then((order) => {
        console.log('✅ Order created successfully!');
        console.log('Order ID:', order.id);
    })
    .catch((error) => {
        console.error('❌ Error creating order:');
        console.error('Message:', error.message);
        console.error('Description:', error.description);
        console.error('Status Code:', error.statusCode);
        console.error('Error object:', error.error);
    });
