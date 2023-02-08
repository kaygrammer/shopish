

// userSchema.pre('save', async function(){
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt)
// })
// UserSchema.methods.createJWT = function () {
//     return jwt.sign({userId:this._id, name:this.name}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME,})
// }


// UserSchema.methods.comparePassword = async function (candidatePassword) {
//     const isMatch = await bcrypt.compare(candidatePassword, this.password)
//     return isMatch}