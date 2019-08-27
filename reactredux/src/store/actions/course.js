export function toggleLesson(lesson, module){
    return {
        type: 'TOGGLE_LESSON',
        lesson,
        module,
    };
}