import settings_button from "./comp-assets/settings.svg"
import "../styles/userprofile.css"
import {  useState } from "react";
export function UserProfile({userData, onSettingsClicked}) {
    const firstLetter = userData.username ? userData.username[0].toUpperCase() : '';

   
    return (
        <>
        <div className="profile-container">
            <div className="profile-pic">
                {firstLetter}
            </div>
            <div className="user-data-container">{userData.username}
                <p>{userData.id}</p>
            </div>
            <div className="settings-container">
                <img onClick={() => onSettingsClicked(prev => !prev)} src={settings_button} alt="settings button"/>
            </div>
        </div>
        </>
    )
    
}