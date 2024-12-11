import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Row, Col, Image } from "react-bootstrap";
import Swal from "sweetalert2";

export default function Profile() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:4000/users/details", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(result => result.json())
        .then(data => {
            if (data.code === "USER-FOUND") {
                setUserProfile(data.result);
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.message,
                    icon: "error"
                });
            }
        })
        .catch(() => {
            Swal.fire({
                title: "Error",
                text: "Something went wrong!",
                icon: "error"
            });
        });
    }, []);

    const handleUpdate = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            Swal.fire({
                title: "Passwords don't match!",
                text: "Make sure the passwords match.",
                icon: "error"
            });
            return;
        }

        const token = localStorage.getItem("token");

        fetch("http://localhost:4000/users/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                newPassword: newPassword,
                confirmPassword: confirmPassword
            })
        })
        .then(result => result.json())
        .then(data => {
            if (data.code === "UPDATE-SUCCESS") {
                Swal.fire({
                    title: "Password Updated",
                    text: data.message,
                    icon: "success"
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.message,
                    icon: "error"
                });
            }
        })
        .catch(() => {
            Swal.fire({
                title: "Error",
                text: "Something went wrong!",
                icon: "error"
            });
        });
    };

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card className="border-0 rounded-lg shadow-lg p-4" style={{ maxWidth: "800px", width: "100%" }}>
                <Row>
                    <Col md={4} className="text-center mb-4">
                        <Image
                            src="https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg"
                            roundedCircle
                            fluid
                            className="mb-3"
                        />
                        <h5 className="text-dark" style={{ fontSize: "1.4rem", fontWeight: "600" }}>
                            {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : "Loading..."}
                        </h5>
                        <p className="text-muted">{userProfile ? userProfile.email : ""}</p>
                        <p className="text-muted">{userProfile ? userProfile.contactNumber : ""}</p>
                    </Col>
                    <Col md={8}>
                        <h4 className="text-center mb-4 mt-5 mx-5">Change Your Password</h4>
                        <Form onSubmit={handleUpdate}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: "500", fontSize: "1rem" }}>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter a new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: "500", fontSize: "1rem" }}>Confirm New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary" block>
                                Update Password
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
}
