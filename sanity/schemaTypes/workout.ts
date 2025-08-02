import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'workout',
  title: 'Workout',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'The Clerk user ID of the person who performed this workout',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Workout Date',
      type: 'datetime',
      description: 'When this workout was performed',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      description: 'Total duration of the workout in seconds',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'exercises',
      title: 'Exercises',
      type: 'array',
      description: 'List of exercises performed in this workout',
      of: [
        {
          type: 'object',
          name: 'workoutExercise',
          title: 'Workout Exercise',
          fields: [
            defineField({
                name: 'exercise',
                title: 'Exercise',
                type: 'reference',
                to: [{type: 'exercise'}],
                description: 'Reference to the exercise performed',
                validation: (Rule) => Rule.required(),
            }),
            defineField({
                name: 'sets',
                title: 'Sets',
                type: 'array',
                description: 'The sets performed for this exercise with reps and weight details',
                of : [
                    defineArrayMember ({
                        type: 'object',
                        name: 'set',
                        title: 'Exercise Set',
                        fields : [
                            defineField({
                                name: 'reps',
                                title: 'Repetitions',
                                type: 'number',
                                description: 'Number of repetitions performed',
                                validation: (Rule) => Rule.required().positive(),
                            }),
                            defineField ({
                                name: 'weight',
                                title: 'Weight',
                                type: 'number',
                                description: 'Weight used for the exercise (if applicable)',
                                validation: (Rule) => Rule.positive(),
                            }),
                            defineField({
                                name: 'weightUnit',
                                title: 'Weight Unit',
                                type: 'string',
                                description: 'Unit of measurement for the weight',
                                options: {
                                  list: [
                                    {title: 'Pounds (lbs)', value: 'lbs'},
                                    {title: 'Kilograms (kg)', value: 'kg'},
                                  ],
                                  layout: 'radio',
                                },
                                initialValue: 'lbs',
                
                          }),
                        ],
                        preview: {
                            select: {
                                reps: 'reps',
                                weight: 'weight',
                                weightUnit: 'weightUnit',
                            },
                            prepare({reps, weight, weightUnit}) {
                                return {
                                  title: `Set: ${reps} reps`,
                                  subtitle: weight ? `${weight} ${weightUnit}` : 'Bodyweight',
            
                                }
                            }
                        }

                    })
                ],
                validation: (Rule) => Rule.required().min(1),
              
            }),
                 
          ],
          preview: {
            select: {
             title: 'exercise.name',
             sets: 'sets',
            },
            prepare({title, sets}) {
                const setCount = sets ? sets.length : 0;
                return {
                  title: title || 'Exercise',
                  subtitle: `${setCount} set${setCount !== 1 ? 's': ''}`
                }
               
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],

  preview: {
    select: {
      date: 'date', 
      duration: 'duration',
      exercises: 'exercises'
    },
    prepare({date, duration, exercises}) {
        const workoutDate = date ?  new Date(date).toLocaleDateString() : 'No Date';
        const workoutDuration = duration ? Math.round(duration / 60)  : 0;
        const exercisesCount = exercises ? exercises.length : 0;
      
        return {
          title: `Workout ${workoutDate}`,
          subtitle: `${workoutDuration} min - ${exercisesCount} exercises${exercisesCount !== 1 ? 's' : ''}`,   
        }
       
    },
  },
})
