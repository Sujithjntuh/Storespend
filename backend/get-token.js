require("dotenv").config({ path: ".env" });

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY
);

const email = "owner@storespend.com";
const password = "storespend@123";

async function getToken() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error("Login failed:", error.message);
        return;
    }

    console.log("Login successful");
    console.log("Access Token:");
    console.log(data.session.access_token);
}

getToken();