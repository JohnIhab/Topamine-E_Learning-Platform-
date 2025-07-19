import React from "react";

const VideoPage = () => {
    return (
        <div>
            <h2>🎉 شكراً على الدفع</h2>
            <video width="100%" height="400" controls>
                <source src="https://player.cloudinary.com/embed/?cloud_name=duljb1fz3&public_id=videos%2Fbuxadphr1l8khdc9c79w&profile=cld-default" type="video/mp4" />
                المتصفح لا يدعم عرض الفيديو.
            </video>
        </div>
    );
};

export default VideoPage;
