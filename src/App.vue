<template>
    <div id="app">
        <v-app :dark="dark">
            <v-date-range-picker 
                :allow-back-in-time=true
                :auto-hide=false     
                :color="color"
                :no-title=false
                :multi-range=false
                :show-week=true
                :transitions=true
                type="date"
                width="290px"
                :range=true
                @input="log"
                :num-pickers=4
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
        color: ["primary", "warning", "info", "error"]
    }),
    methods: {
        log(e) {
            console.log(e)
        }
    }
};
</script>

<style>

</style>?