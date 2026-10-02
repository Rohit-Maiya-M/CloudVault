import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./Register.css";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            await register({
                username,
                email,
                password,
            });

            navigate("/dashboard");
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                "Unable to create account.";

            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">

                <div className="register-header">

                    <div className="register-brand">
                        <div className="register-brand-mark">
                            C
                        </div>

                        <span className="register-brand-name">
                            CloudVault
                        </span>
                    </div>

                    <h1>Create your account</h1>

                    <p>
                        Create an account to securely store and manage your files.
                    </p>

                </div>

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >
                    <div className="register-form-group">

                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            placeholder="Choose a username"
                            required
                            minLength={3}
                            maxLength={50}
                        />

                    </div>

                    <div className="register-form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="you@example.com"
                            required
                        />

                    </div>

                    <div className="register-form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Create a password"
                            required
                            minLength={8}
                            maxLength={100}
                        />

                    </div>

                    {error && (
                        <p className="register-error">
                            {error}
                        </p>
                    )}

                    <button
                        className="register-submit"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Creating account..."
                            : "Create Account"}
                    </button>

                </form>

                <div className="register-footer">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login">
                            Sign in
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}