import bcrypt from 'bcrypt';
import User from '../models/User.ts';

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (err) {
    console.error("Error verifying password:", err);
    return false;
  }
}

export async function registerUser(data: { username: string; password: string }) {
  try {
    const { username, password } = data;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({ username, password: hashedPassword });
    return { success: true, message: "User created successfully", user: newUser };
  } catch (err) {
    console.error("Error creating user:", err);
    return { success: false, message: "Failed to create user", error: err };
  }
}

export async function verifyUser(data: { username: string; password: string }) {
  try {
    const { username, password } = data;
    const user = await User.findOne({ username });
    if (!user) {
      return { success: false, message: "User not found" };
    }
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return { success: false, message: "Invalid credentials" };
    }
    return { success: true, UserData: user };
  } catch (err) {
    console.error("Error verifying user:", err);
    return { success: false, message: "An error occurred" };
  }
}

