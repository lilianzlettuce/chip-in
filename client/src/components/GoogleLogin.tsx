import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from "@react-oauth/google";   

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';                      
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export default () => {
	const navigate = useNavigate();

	const responseGoogle = async (authResult: any) => {
		try {
			if (authResult["code"]) {
				console.log(authResult.code);
				try {
					const res = await fetch(`http://localhost:6969/auth/google?code=${authResult.code}`);
			
					if (res.ok) {
						const data = await res.json();
						console.log('google auth data', data);
				
						// Store token and redirect upon successful login
						if (data.token) {
							localStorage.setItem("token", data.token);
							navigate(`/profile/${data.id}`);
						}
					} else {
					  console.error("Failed to fetch user profile");
					}
				} catch (err) {
					console.error('Google auth error:', err);
				}
			} else {
				console.log(authResult);
				throw new Error(authResult);
			}
		} catch (e) {
			console.log(e);
		}
	};

	const googleLogin = useGoogleLogin({
		onSuccess: responseGoogle,
		onError: responseGoogle,
		flow: "auth-code",
	});

	return (
		<button
			className="auth-btn mb-4 flex gap-3 justify-center items-center"
			onClick={googleLogin}
		>
			<FontAwesomeIcon icon={faGoogle} className="text-white text-lg" />
			<div>Log in with Google</div>
		</button>
	);
};