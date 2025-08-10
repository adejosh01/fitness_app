import { View, Text, TextInput, TouchableOpacity, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {defineQuery} from "groq"
import { client } from '@/lib/sanity/client';
import { Exercise } from '@/lib/sanity/types';
import { ExerciseCard } from '@/app/components/ExerciseCard';



export const exercisesQuery = defineQuery(`*[_type == "exercise"] {
     ...
  }`)



export default function Exercises() {
  const [seachQuery, setSearchQuery] = useState("");
  const router = useRouter()

  const [refreshing, setRefreshing] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])

  const fetchExercises = async () => {
    try {
      const exercises = await client.fetch(exercisesQuery);
      setExercises(exercises)
      setFilteredExercises(exercises)
    } catch (error) {
      console.error("Error fetching exercises", error)
    }
  }

  useEffect(() => {
    fetchExercises()
  }, [])

  useEffect(() => {
    const filtered = exercises.filter((exercise: Exercise) => {
      const name = exercise?.name || ""; // fallback to empty string
      return name.toLowerCase().includes(seachQuery.toLowerCase());
    });
    setFilteredExercises(filtered);
  }, [seachQuery, exercises]);
  

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchExercises();
    setRefreshing(false);
  }


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

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24 }}
        renderItem={({ item }) => (
          <ExerciseCard
            item={item}
            onPress={() => router.push(`/exercise-detail?id=${item._id}`)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3BB2F6"]} //Andriod
            tintColor="#3BB2F6" //IOS
            title="Pull to refresh exercises"
            titleColor="#6B7280"
          />
        }
      />
    </SafeAreaView>
  );
}

