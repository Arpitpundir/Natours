import axios from "axios";
import {showAlert} from "./alerts";
const stripe = Stripe('pk_test_5dRMlo6cfTjNiRiK2YJQuK9t00p5G7qGfG');

//booktour btn has access to tourId now we will make a request to server for a stripe session
//after getting this session we will create stripe form as an interface where actuall charging will
//take place 
export const bookTour = async (tourId) => {
    try {
        const session = await axios(
            `http://127.0.0.1:3000/api/v1/booking/checkout-sessions/${tourId}`
        );
        console.log(session);

        //create checkout form and charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    }catch(err){
        console.log(err);
        showAlert("error", err);
    }
}