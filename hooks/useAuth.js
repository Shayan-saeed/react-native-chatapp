import { useState } from "react";
import { Alert } from "react-native";
import { auth, db } from "../app/config/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useRouter } from "expo-router";
import { validateEmail, validatePassword } from "@/utils/validation";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (email, password ) => {
    setLoading(true);
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!validateEmail(trimmedEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      router.replace("/chat");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (name, confirmPassword, email, password ) => {
    setLoading(true);
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (trimmedName.length < 2) {
      Alert.alert("Invalid Name", "Name must be at least 2 characters long.");
      setLoading(false);
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!validatePassword(trimmedPassword)) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", trimmedEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert("Account Exists", "A user with this email already exists.");
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      const user = userCredential.user;

      await updateProfile(user, { displayName: trimmedName });

      await setDoc(doc(db, "users", user.uid), {
        email: trimmedEmail,
        name: trimmedName,
        profileImage: "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
      });

      router.replace("/chat");
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleLogin,
    handleSignup,
  };
};
