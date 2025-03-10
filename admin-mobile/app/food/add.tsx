import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, Image } from "react-native";
import {
  TextInput,
  Button,
  Title,
  HelperText,
  Divider,
} from "react-native-paper";
import { router } from "expo-router";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext";
import { FoodFormData, Category } from "../../types";
import Colors from "../../constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Picker } from "@react-native-picker/picker";

const API_URL = "https://food-delivery-backend-cul5.onrender.com/api";

export default function AddFoodScreen() {
  const { admin } = useAuth();
  const [formData, setFormData] = useState<FoodFormData>({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!admin) {
      return;
    }

    fetchCategories();
  }, [admin]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
      if (response.data.length > 0) {
        setFormData((prev) => ({ ...prev, category: response.data[0]._id }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Error", "Failed to fetch categories");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.image) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access media library was denied"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setFormData((prev) => ({ ...prev, image: base64Image }));
      setImagePreview(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const foodData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      await axios.post(`${API_URL}/foods`, foodData);

      Alert.alert("Success", "Food item added successfully", [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/foods"),
        },
      ]);
    } catch (error) {
      console.error("Error adding food:", error);
      Alert.alert("Error", "Failed to add food item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Add New Food</Title>

      <View style={styles.form}>
        <TextInput
          label="Name"
          value={formData.name}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, name: text }))
          }
          mode="outlined"
          style={styles.input}
          error={!!errors.name}
          theme={{
            colors: { primary: Colors[colorScheme ?? "light"].primary },
          }}
          textColor="#FFFFFF"
          outlineColor="#333333"
        />
        {errors.name ? (
          <HelperText type="error">{errors.name}</HelperText>
        ) : null}

        <TextInput
          label="Description"
          value={formData.description}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, description: text }))
          }
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          error={!!errors.description}
          theme={{
            colors: { primary: Colors[colorScheme ?? "light"].primary },
          }}
          textColor="#FFFFFF"
          outlineColor="#333333"
        />
        {errors.description ? (
          <HelperText type="error">{errors.description}</HelperText>
        ) : null}

        <TextInput
          label="Price"
          value={formData.price}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, price: text }))
          }
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          error={!!errors.price}
          theme={{
            colors: { primary: Colors[colorScheme ?? "light"].primary },
          }}
          textColor="#FFFFFF"
          outlineColor="#333333"
        />
        {errors.price ? (
          <HelperText type="error">{errors.price}</HelperText>
        ) : null}

        <Title style={styles.pickerLabel}>Category</Title>
        <View
          style={[
            styles.pickerContainer,
            errors.category ? styles.pickerError : null,
          ]}
        >
          <Picker
            selectedValue={formData.category}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
            style={styles.picker}
            dropdownIconColor={Colors[colorScheme ?? "light"].primary}
          >
            {categories.map((category) => (
              <Picker.Item
                key={category._id}
                label={category.name}
                value={category._id}
                color="#FFFFFF"
              />
            ))}
          </Picker>
        </View>
        {errors.category ? (
          <HelperText type="error">{errors.category}</HelperText>
        ) : null}

        <Divider style={styles.divider} />

        <Button
          mode="contained"
          onPress={pickImage}
          style={styles.imageButton}
          icon="image"
          buttonColor={Colors[colorScheme ?? "light"].secondary}
        >
          Select Image
        </Button>

        {imagePreview && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imagePreview }} style={styles.imagePreview} />
          </View>
        )}

        {errors.image ? (
          <HelperText type="error">{errors.image}</HelperText>
        ) : null}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
          buttonColor={Colors[colorScheme ?? "light"].primary}
        >
          Add Food
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    margin: 16,
    color: "#FFFFFF",
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 8,
    backgroundColor: "#1A1A1A",
  },
  pickerLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 8,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: "#1A1A1A",
  },
  pickerError: {
    borderColor: "#CF6679",
  },
  picker: {
    color: "#FFFFFF",
    backgroundColor: "transparent",
  },
  divider: {
    backgroundColor: "#333333",
    marginVertical: 16,
  },
  imageButton: {
    marginBottom: 16,
  },
  imagePreviewContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  imagePreview: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
});
