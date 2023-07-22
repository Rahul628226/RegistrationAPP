import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Container,
    Grid,
} from "@mui/material";

const Signup = () => {
    const [inpt, setinput] = useState({
        prereg_name: "",
        prereg_email: "",
        prereg_mob: "",
        districtd: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [showOTPDialog, setShowOTPDialog] = useState(false);
    const [otp, setOTP] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setinput((inpt) => ({ ...inpt, [name]: value }));
        console.log(inpt);
    };

    const handleOTPChange = (e) => {
        setOTP(e.target.value);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        registerData();
    };

    const registerData = () => {
        const formData = new FormData();
        formData.append("prereg_name", inpt.prereg_name);
        formData.append("prereg_email", inpt.prereg_email);
        formData.append("prereg_mob", inpt.prereg_mob);
        formData.append("districtd", inpt.districtd);

        console.log(formData);

        axios
            .post("https://yip.kerala.gov.in/yipapp/index.php/Idea2021/add_pre_reg", formData)
            .then(() => {
                alert("Registered Successfully");
                 // Show OTP verification dialog after successful registration
            })
            .catch((err) => {
                console.log(err);
                alert("An error occurred during registration. Please try again later.");
            });
			setShowOTPDialog(true);
    };

    const handleOTPSubmit = (e) => {
        e.preventDefault();

        // Prepare the data to be sent to the server
        const otpData = {
            otp_received: otp,
            user_id: inpt.prereg_email,
            prereg_name: inpt.prereg_name,
            prereg_email: inpt.prereg_email,
            prereg_mob: inpt.prereg_mob,
            districtd: inpt.districtd,
        };

        // Send the OTP data to the server for verification
        axios
            .post("https://dev.yip.kerala.gov.in/yipapp/index.php/Com_mobile_otp/checkotp", otpData)
            .then((response) => {
                const { validation, Success } = response.data;
                if (validation && Success === "0") {
                    // OTP verification successful, show the success message in the dialog
                    setOpenDialog(false); // Close the OTP verification dialog
                    alert("Username and password successfully sent to your email.");
                } else {
                    // OTP verification failed, show an error message in the dialog
                    alert("Invalid OTP. Please try again.");
                }
            })
            .catch((err) => {
                console.log(err);
                alert("An error occurred during OTP verification. Please try again later.");
            });
    };

    return (
        <div className={styles.signup_container}>
            <div className={styles.signup_form_container}>
                <div className={styles.left}>
                    <h1>Welcome Back</h1>
                    <Link to="/login">
                        <button type="button" className={styles.white_btn}>
                            Sing in
                        </button>
                    </Link>
                </div>
                <div className={styles.right}>
                    <form className={styles.form_container} onSubmit={handleSubmitForm}>
                        <h1>Create Account</h1>
                        <input
                            type="text"
                            placeholder="Name"
                            name="prereg_name"
                            onChange={handleChange}
                            value={inpt.prereg_name}
                            required
                            className={styles.input}
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            name="prereg_email"
                            onChange={handleChange}
                            value={inpt.prereg_email}
                            required
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Phone No"
                            name="prereg_mob"
                            onChange={handleChange}
                            value={inpt.prereg_mob}
                            required
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="District"
                            name="districtd"
                            onChange={handleChange}
                            value={inpt.districtd}
                            required
                            className={styles.input}
                        />
                        {error && <div className={styles.error_msg}>{error}</div>}
                        <button type="submit" className={styles.green_btn}>
                            Sing Up
                        </button>
                    </form>
                </div>
            </div>
            <Dialog open={showOTPDialog} onClose={handleCloseDialog}>
                <DialogTitle>OTP Verification</DialogTitle>
                <DialogContent>
                    <p>Please enter the OTP sent to your email/phone number.</p>
                    <TextField
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={handleOTPChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleOTPSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Signup;
