<template>
    <div id="app">
        <v-app :dark="dark">
            <v-date-range-picker       
                :color="color"
                type="date"
                width="290px"
                :range=true
            ></v-date-range-picker>
        </v-app>
    </div>
</template>

<script>
import VDateRangePicker from 'components/DateRangePicker.vue'
export default {
    components: {
        VDateRangePicker
    },
    data: () => ({
        date: null,
        menu: false,
        dark: true,
        color: ["primary", "warning"]
    })
};
</script>

<style>

</style>?