const {createClient} = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY
);

async function authenticate(req, res, next) {
    try {
        
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token required"
            });
        }

        const token = authHeader.split(" ")[1];
        const {data: { user },error} = await supabase.auth.getUser(token);

        if(error || !user){
            return res.status(401).json({
                success : false,
                message : "Invalid or expired token"
            });
        }

        req.user = user;
        next();
    }
    catch(error){
        console.log("Authentication error: " ,error.message);
        return res.status(500).json({
            success : false,
            message : "Authentication failed"
    });

    }
}

module.exports = authenticate;