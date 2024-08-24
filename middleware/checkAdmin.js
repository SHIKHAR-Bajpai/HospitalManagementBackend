const isAdmin = async (userId) => {
    try{
        const user = await user.findById(userId)
        if(user.LoginAs === "Admin"){
            return true
        }
    }catch(err){
        return false;
    }

}

module.exports = isAdmin