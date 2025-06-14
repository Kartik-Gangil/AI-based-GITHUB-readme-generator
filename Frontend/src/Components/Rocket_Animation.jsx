import { Player } from '@lottiefiles/react-lottie-player';

export default function Rocket_Animation() {
    return (
        <Player
            autoplay
            loop
            src="/Animation - 1749886549915.json" // path relative to public/
            style={{ height: '100px', width: '100px' }}
           
        />
    );
}
