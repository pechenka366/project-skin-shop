import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const name = urlParams.get('name');
    const email = urlParams.get('email');

    if (id && name && email) {
      const user = { _id: id, name, email };
      localStorage.setItem('user', JSON.stringify(user));
      
      window.dispatchEvent(new CustomEvent('userLogin', { detail: user }));
      
      navigate('/');
    } else {
      navigate('/');
    }
  }, [navigate]);

  return <div>Вход выполняется...</div>;
}

export default AuthSuccess;