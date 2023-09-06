import { ref, watchEffect } from 'vue'

function usePersonData(url, token) {
    let person = ref({})
    let personName = ref('')
    let personDocument = ref('')

    watchEffect(() => {
        fetch(url + '/intranet/person/profile', {
            headers: {
                'X-Accesss-Token': token
            }
        })
            .then((response) => response.json())
            .then((data) => {
                person.value = data
                personName.value = data.name + ' ' + data.paternal + ' ' + data.maternal
                personDocument.value = data.document_number
            })
    })

    return { person, personName, personDocument }
}

export { usePersonData }
