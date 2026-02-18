import React, { useState, useEffect, useRef } from 'react';
import { Modal, StyleSheet, TouchableOpacity, Text, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Numpad from './Numpad';

interface MemberNumpadModalProps {
    visible: boolean;
    onClose: () => void;
    onScan: (phoneNumber: string) => void;
    initialValue?: string;
    loading?: boolean;
}

export default function MemberNumpadModal({
    visible,
    onClose,
    onScan,
    initialValue = '',
    loading = false,
}: MemberNumpadModalProps) {
    const [phoneNumber, setPhoneNumber] = useState(initialValue);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (visible) {
            setPhoneNumber(initialValue);
            // Small timeout to ensure autoFocus works on some platforms
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [visible, initialValue]);

    const handleKeyPress = (value: string | number) => {
        if (value === 'C') {
            setPhoneNumber('');
        } else if (value === '←') {
            setPhoneNumber(prev => prev.slice(0, -1));
        } else if (value === '') {
            // Do nothing for empty keys
        } else {
            setPhoneNumber(prev => prev + value.toString());
        }
        inputRef.current?.focus();
    };

    const handleScan = () => {
        onScan(phoneNumber);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Member Scan</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.phoneDisplay}>
                            <Ionicons name="call-outline" size={20} color="#9ca3af" style={styles.phoneIcon} />
                            <TextInput
                                ref={inputRef}
                                style={styles.phoneInput}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                placeholder="Enter phone number"
                                placeholderTextColor="#9ca3af"
                                keyboardType="phone-pad"
                                onSubmitEditing={handleScan}
                            />
                        </View>
                    </View>

                    <Numpad onKeyPress={handleKeyPress} />

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.scanButton, (loading || !phoneNumber) && styles.scanButtonDisabled]}
                            onPress={handleScan}
                            disabled={loading || !phoneNumber}
                        >
                            <Text style={styles.scanButtonText}>
                                {loading ? 'Scanning...' : 'Scan Member'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '40%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    closeButton: {
        padding: 4,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6b7280',
        marginBottom: 8,
    },
    phoneDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
    },
    phoneIcon: {
        marginRight: 12,
    },
    phoneInput: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4b5563',
    },
    scanButton: {
        flex: 2,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#2563eb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanButtonDisabled: {
        backgroundColor: '#94a3b8',
    },
    scanButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});
