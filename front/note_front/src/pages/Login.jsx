export const Login = () => {
    return (
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border pt-6 px-4 pb-4">
            <h2 className="text-black text-lg font-bold mb-4 text-center">Login</h2>

            <label className="label text-black">Email</label>
            <input 
                type="email" 
                className="input placeholder-gray-400 text-black" 
                placeholder="Email" 
                style={{ '--tw-placeholder-opacity': '1', '--tw-text-opacity': '1' }} 
            />

            <label className="label text-black">Password</label>
            <input 
                type="password" 
                className="input placeholder-gray-400 text-black" 
                placeholder="Password"
                style={{ '--tw-placeholder-opacity': '1', '--tw-text-opacity': '1' }} 
            />

            <div className="flex gap-2 mt-4">
                <button className="btn btn-neutral flex-1">Se connecter</button>
                <button className="btn btn-outline flex-1">S'inscrire</button>
            </div>
        </fieldset>
    );
};
