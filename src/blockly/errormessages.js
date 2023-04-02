/**
 * Create a generic setter block error message function.
 * @param {string} objectType
 * @return {Function}
 */
function genericSetterError(objectType) {
  return () => 'Tried to modify ' + objectType + ' that doesn\'t exist.';
}

/**
 * Create a generic getter block error message function.
 * @param {string} objectType
 * @return {Function}
 */
function genericGetterError(objectType) {
  return () => 'Tried to get a property of ' + objectType + ' that doesn\'t exist.';
}

export default {
  'text_length': () => 'Tried to get the length of non-text element.',
  'text_empty': () => 'Tried to check if a non-text element is empty.',
  'text_indexOf': () => 'Tried to get the first/last occurrence of a piece of text in a non-text element.',
  'text_charAt': () => 'Tried to get a letter from a non-text element.',
  'text_getSubstring': () => 'Tried to get a substring of a non-text element.',
  'text_changeCase': () => 'Tried to change the case of a non-text element.',
  'text_trim': () => 'Tried to trim a non-text element.',
  'lists_getIndex': () => 'Tried to get an item from a list that doesn\'t exist.',
  'lists_setIndex': () => 'Tried to modify a list that doesn\'t exist.',
  'lists_indexOf': () => 'Tried to get the first/last occurrence of an item in a list that doesn\'t exist.',
  'lists_isEmpty': () => 'Tried to check if a non-existent list is empty.',
  'lists_isSublist': () => 'Tried to get a sublist of a list that doesn\'t exist.',
  'lists_split': (e) => e.includes('split') ? 'Tried to make a list from non-existent text.' : 'Tried to make text from a list that doesn\'t exist.',
  'lists_sort': () => 'Tried to sort a list that doesn\'t exist.',
  'obj_no_lerp': () => 'Tried to disable interpolation of a non-existent object.',
  'drawing_attach': () => 'Tried to change attachment of a drawing that doesn\'t exist.',
  'drawing_shape_no_lerp': () => 'Tried to disable interpolation of a non-existent drawing shape.',
  'drawing_shape_amount': () => 'Tried to get the shape amount of a drawing that doesn\'t exist.',
  'drawing_shape_remove': () => 'Tried to remove a shape from a drawing that doesn\'t exist.',
  'plat_shape_amount': () => 'Tried to get the shape amount of a platform that doesn\'t exist.',
  'disc_prop_set': genericSetterError('a disc'),
  'disc_prop_get': genericGetterError('a disc'),
  'arrow_prop_set': genericSetterError('an arrow'),
  'arrow_prop_get': genericGetterError('an arrow'),
  'plat_prop_set': genericSetterError('a platform'),
  'plat_prop_get': genericGetterError('a platform'),
  'plat_shape_prop_set': genericSetterError('a platform shape'),
  'plat_shape_prop_get': genericGetterError('a platform shape'),
  'drawing_prop_set': genericSetterError('a drawing'),
  'drawing_prop_get': genericGetterError('a drawing'),
  'drawing_shape_prop_set': genericSetterError('a drawing shape'),
  'drawing_shape_t_align_get': genericSetterError('a drawing shape'),
  'drawing_shape_prop_get': genericGetterError('a drawing shape'),
  'lobby_playerinfo_get': genericGetterError('a player'),
  'input_pressing': () => 'Tried to read the inputs of a player that doesn\'t exist.',
  'input_override': () => 'Tried to override the inputs of a player that doesn\'t exist.',
  'input_override_stop': () => 'Tried to stop input overrides of a player that doesn\'t exist.',
  'input_mouse_pos': () => 'Tried to get the mouse position of a player that doesn\'t exist.',
  'input_disable_mouse_pos': () => 'Tried to disable the mouse position of a player that doesn\'t exist.',
  'procedures_defreturn': (e) => e.includes('call stack size') || e.includes('recursion') ? 'Called a function inside the same function way too many times.' : 'Unknown error! Sorry :(',
  'procedures_defnoreturn': (e) => e.includes('call stack size') || e.includes('recursion') ? 'Called a function inside the same function way too many times.' : 'Unknown error! Sorry :(',
};
