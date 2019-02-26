<template>                           
    <v-item-group value="false" class="hidden-lg-and-down">
        <v-layout align-center justify-start row fill-height class="overflow-hidden; pl-3 pt-1">
            <v-item v-for="(option,index) in pickerOptions"
                :key="index"
            >
                <div v-if="option.visible" slot-scoped="{ active }">
                    {{option.title}}
                    <v-btn flat fab small @click="showHidePanel(option)" slot="activator" class="mr-2">
                    
                        <v-icon>{{option.show ? 'unfold_less' : 'unfold_more'}}</v-icon>
                    
                    </v-btn>

                    <v-btn-toggle v-model="btnGroup" v-if="option.show" class="mx-2">
                        <template v-for="(compo,index) in option.options">
                            <component v-if="(allowBackInTime || evaluate(compo.if))" 
                                class="ma-0 mx-1 pa-0 px-1"
                                :clearable="multiRange || compo.multiple"
                                :deletable-chips=true
                                :dense=true
                                :flat=true
                                :hide-details=true                                                    
                                :is="compo.type"
                                :items="buildSelectionList(compo.items)"
                                :item-text="getItemText"
                                :item-value="getItemValue"
                                :key="index"
                                :label="compo.label"
                                :loading="compo.loading"
                                :multiple="compo.multiple"
                                :no-data-text="compo.label"
                                :prepend-icon="compo.icon"
                                :ref="compo.ref"
                                :single-line=true
                                :small-chips=true
                                style="max-width:220px;"
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
                                    v-bind:compo="compo"
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
                                        <!-- <template v-if="compo.value.length <= 2">
                                            <v-chip :small=true>
                                                <span>{{ item.text }}</span>
                                            </v-chip>
                                        </template>
                                        <template v-else>     -->
                                            <v-chip v-if="index === 0" :small=true>
                                                <span>{{ item.text }}</span>
                                            </v-chip>
                                            <span v-if="index === 1"
                                                class="grey--text caption"
                                            >(+{{ compo.value.length - 1}} others)</span>
                                        <!-- </template> -->
                                    </template>
                                </template>
                                <template slot="default">
                                    {{ compo.title }}
                                </template>   
                            </component> 
                        </template>
                    </v-btn-toggle>
                </div>
                <div v-else slot-scoped="{action}"></div>
        
            </v-item>
        </v-layout>
    </v-item-group>
</template>  

<script>
import QuickSelectHelper from './mixins/DateRangeQuickSelectDates.js'
import DateRangePlugin from './mixins/DateRangePlugin.js'

export default {
    name: 'VDateRangePanel',
    mixins: [QuickSelectHelper, DateRangePlugin],
    props: {
        allowBackInTime: {
            type: Boolean,
            default: true
        },
    }
}
</script>