/* eslint-disable import/no-anonymous-default-export */
import { useGoogleLogin } from "@react-oauth/google";
                              

export default () => {
	const responseGoogle = async (authResult: any) => {
		try {
			if (authResult["code"]) {
				console.log(authResult.code);
				//const result = await googleAuth(authResult.code);

				try {
					const res = await fetch(`http://localhost:6969/auth/google?code=${authResult.code}`);
			
					if (res.ok) {
						const data = await res.json();
						console.log('google auth data', data);
				
						if (data.token) {
							localStorage.setItem("token", data.token);
						}
					} else {
					  console.error("Failed to fetch user profile");
					}
				} catch (err) {
					console.error('Google auth error:', err);
				}

				/*console.log(result);
				//props.setUser(result.data.data.user);
				alert("successfuly logged in");

				// Store token
				if (result.data.token) {
					localStorage.setItem("token", result.data.token);
				}*/
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
			style={{
				padding: "10px 20px",
			}}
			onClick={googleLogin}
		>
			Sign in with Google
		</button>
	);
};