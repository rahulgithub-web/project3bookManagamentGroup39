// const mongoose = require('mongoose')

//Name Validation
const isValidName = function (name) {
    const nameRegex = /^[a-zA-Z ]+$/
    return nameRegex.test(name)
}

//Email Validation 
const isValidEmail = function (email) {
    const emailRegex = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/
    return emailRegex.test(email)
}

const isValidPassword = function (password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    return passwordRegex.test(password)
}

//Mobile Validation
const isValidPhone = function (phone) {
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(phone)
}

// pinCode Validation 
const isValidPinCode = function (pinCode) {
    const pinCode = /[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$/; 
    return pinCode.test(pinCode)
}

//Value Validation
const isEmpty = function(value){
    if(typeof value ==='undefined' || value === null)  return false
    if(typeof value ==='string' && value.trim().length ===0)return false
    return true
}
  
module.exports = {
    isEmpty,
    isValidName,
    isValidEmail,
    isValidPhone,
    isValidPassword,
}