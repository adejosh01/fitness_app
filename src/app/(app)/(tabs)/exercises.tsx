import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';

const Exercises = () => {
  const [seachQuery, setSearchQuery] = useState("");
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 bg-white border-b border-gray-300">
        <Text className="text-2xl font-bold text-gray-900">
          Exercise Library
        </Text>
        <Text>Discover and master new exercises</Text>

        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2 mt-4">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-800"
            placeholder="Search Exercises"
            placeholderTextColor="#9CA3AF"
            value={seachQuery}
            onChangeText={setSearchQuery}
          />

          {seachQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Exercises