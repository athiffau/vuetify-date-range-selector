<template>
    <v-navigation-drawer
        v-model="isOpen"
        absolute
        temporary
    >
        <v-layout column fill-height>
            <v-toolbar
                color="primary"
                dark
                flat
                >
                <v-list class="pa-1">
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <v-icon>event</v-icon>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title>Picker Options</v-list-tile-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                            <v-btn flat fab small @click="toggleOptionsDrawer">
                                <v-icon >chevron_left</v-icon>
                            </v-btn> 
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-toolbar>
            <v-flex xs10 sm6 md4>
                <v-list class="pa-1" >
                    <v-list-group
                        v-for="(option,index) in pickerOptions" 
                        :key="index"
                        v-model="option.active"
                        :prepend-icon="option.icon"
                        no-action
                    >
                        <v-list-tile slot="activator">
                            <v-list-tile-title>{{ option.title }}</v-list-tile-title>
                        </v-list-tile>

                        <v-list-tile-content>
                            <v-layout align-center justify-start column fill-height>
                                <v-btn-toggle style="flex-direction: column; width: 100%;" v-model="btnGroup">
                                    <template v-for="(compo,index) in option.options">
                                        <v-layout v-if="(allowBackInTime || evaluate(compo.if))" row fill-height :key="index" class="mx-3 py-1"> 
                                            <component
                                                block
                                                :clearable="multiRange || compo.multiple"
                                                :deletable-chips=true
                                                :dense=true
                                                flat 
                                                :hide-details=true
                                                :hint="compo.hint" 
                                                :is="compo.type"
                                                :items="buildSelectionList(compo.items)"
                                                :item-text="getItemText"
                                                :item-value="getItemValue"
                                                :label="compo.label"
                                                :loading="compo.loading"
                                                :multiple=true
                                                :no-data-text="compo.label"
                                                :prepend-icon="compo.icon"
                                                style="width: 100%;"
                                                :single-line=true
                                                :small-chips=true
                                                
                                                @change="onAction(
                                                            pickerDate,
                                                            $event, 
                                                            compo.action, 
                                                            typeof compo.value === 'boolean' ? !compo.value : compo.value, 
                                                            getSiblingData(option, compo.needs) || null,
                                                            compo.if
                                                        )"
                                                :value="compo.isOpen"
                                                v-bind:compo="compo"
                                                v-model="compo.value"
                                            >
                                                <template
                                                    slot="selection"
                                                    slot-scope="{item, index}"
                                                >
                                                    <template v-if="item.text.length > 5">
                                                        <template v-if="compo.value.length === 1">
                                                            <v-chip v-if="index === 0" :small=true>
                                                                <span>{{ item.text }}</span>
                                                            </v-chip>
                                                        </template>
                                                        <template v-else>
                                                            <span v-if="index === 0"
                                                                class="grey--text"
                                                            >
                                                                {{compo.value.length}} selected
                                                            </span>
                                                        </template>
                                                    </template>
                                                    <template v-else>                                                        
                                                        <template v-if="compo.value.length <= 3">
                                                            <v-chip :small=true>
                                                                <span>{{ item.text }}</span>
                                                            </v-chip>
                                                        </template>
                                                        <template v-else>    
                                                            <v-chip v-if="index <= 1" :small=true>
                                                                <span>{{ item.text }}</span>
                                                            </v-chip>
                                                            <span v-if="index === 2"
                                                                class="grey--text caption"
                                                            >(+{{ compo.value.length - 2}} others)</span>
                                                        </template>
                                                    </template>
                                                </template>
                                                <template slot="default">
                                                    {{ compo.title }}
                                                </template> 
                                            </component>
                                        </v-layout>
                                    </template>
                                </v-btn-toggle>
                            </v-layout>
                        </v-list-tile-content>

                    </v-list-group>
                </v-list>
            </v-flex>
        </v-layout>
    </v-navigation-drawer>
</template>

<script>
import QuickSelectData from './mixins/DateRangeQuickSelectDates.js'
import DateRangePlugin from './mixins/DateRangePlugin.js'

export default {
    name: 'VDateRangeDrawer',
    mixins: [QuickSelectData, DateRangePlugin],
    data:() => ({
        isOpen: false
    }),
    props: {
        allowBackInTime: {
            type: Boolean,
            default: true
        },
        pickerDrawerVisible: {
            type: Boolean,
            default: false
        }
    },
    inject: ['locale', 'mode'],
    methods: {
        /**
         * In support of quick selection helpers;
         * 
         * Hide or show the picker options drawer
         * 
         * @return {void}
         */
        toggleOptionsDrawer () {
            this.isOpen = !this.isOpen
        },        
    },
    watch: {
        pickerDrawerVisible: {
            handler(val) {
                this.isOpen = val
            }
        },
        isOpen: {
            handler(val) {
                this.$emit('update:pickerVisible', val)
            }
        }
    },
}
</script>