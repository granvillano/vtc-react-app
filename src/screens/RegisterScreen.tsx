/**
 * Pantalla de Registro
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface RegisterScreenProps {
    navigation: any;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateForm = (): boolean => {
        if (
            !formData.username ||
            !formData.email ||
            !formData.password ||
            !formData.firstName ||
            !formData.lastName ||
            !formData.phone
        ) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return false;
        }

        if (formData.password.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            Alert.alert('Error', 'El email no es válido');
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const { confirmPassword, ...registerData } = formData;
            const response = await register(registerData);

            if (response.success) {
                Alert.alert(
                    'Registro exitoso',
                    'Tu cuenta ha sido creada. Un administrador debe aprobarla antes de que puedas usarla. Te notificaremos por email cuando esté lista.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('Login'),
                        },
                    ]
                );
            } else {
                Alert.alert('Error', response.error || 'Error al crear la cuenta');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Error al registrar usuario');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <Text style={styles.title}>Crear Cuenta</Text>
                    <Text style={styles.subtitle}>Regístrate en VTC Premium</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nombre de usuario"
                        placeholderTextColor="#999"
                        value={formData.username}
                        onChangeText={(value) => updateField('username', value)}
                        autoCapitalize="none"
                        editable={!isLoading}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        value={formData.email}
                        onChangeText={(value) => updateField('email', value)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        editable={!isLoading}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                        placeholderTextColor="#999"
                        value={formData.firstName}
                        onChangeText={(value) => updateField('firstName', value)}
                        editable={!isLoading}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Apellidos"
                        placeholderTextColor="#999"
                        value={formData.lastName}
                        onChangeText={(value) => updateField('lastName', value)}
                        editable={!isLoading}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Teléfono (ej: +34 600 000 000)"
                        placeholderTextColor="#999"
                        value={formData.phone}
                        onChangeText={(value) => updateField('phone', value)}
                        keyboardType="phone-pad"
                        editable={!isLoading}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        placeholderTextColor="#999"
                        value={formData.password}
                        onChangeText={(value) => updateField('password', value)}
                        secureTextEntry
                        autoCapitalize="none"
                        editable={!isLoading}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar contraseña"
                        placeholderTextColor="#999"
                        value={formData.confirmPassword}
                        onChangeText={(value) => updateField('confirmPassword', value)}
                        secureTextEntry
                        autoCapitalize="none"
                        editable={!isLoading}
                    />

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Crear Cuenta</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => navigation.navigate('Login')}
                        disabled={isLoading}
                    >
                        <Text style={styles.linkText}>
                            ¿Ya tienes cuenta? <Text style={styles.linkBold}>Inicia sesión</Text>
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.disclaimer}>
                        Al registrarte, aceptas que un administrador revise y apruebe tu cuenta
                        antes de poder usar la aplicación.
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    button: {
        height: 50,
        backgroundColor: '#000',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#999',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    linkButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#666',
        fontSize: 14,
    },
    linkBold: {
        color: '#000',
        fontWeight: '600',
    },
    disclaimer: {
        marginTop: 20,
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        lineHeight: 18,
    },
});
