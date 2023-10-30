"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TokenFetcher = () => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getAccessToken`);
                setToken(response.data.accessToken);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchToken();
    }, []);

    const handleButtonClick = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/getJob`);
            setToken(response.data.accessToken);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <p>Your Access Token: {token}</p>
            <button onClick={handleButtonClick}>Invia richiesta</button>
        </div>
    );
}

export default TokenFetcher;

