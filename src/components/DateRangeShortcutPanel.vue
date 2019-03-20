<template>                           
    <v-item-group value="false" class="hidden-lg-and-down">
        <v-layout align-center justify-start row fill-height class="overflow-hidden; pl-3 pt-1">
            <v-item v-for="(option,pindex) in pickerOptions"
                :key="pindex"
            >
                <div v-if="option.visible" slot-scoped="{ active }">
                    {{ $vuetify.t(option.title) }}
                    <v-btn flat fab small @click="showHidePanel(option)" slot="activator" class="mr-2">                    
                        <v-icon>{{option.show ? 'unfold_less' : 'unfold_more'}}</v-icon>                    
                    </v-btn>
                    <v-btn-toggle v-model="btnGroup" class="mx-2" value="true">
                        <template v-if="option.type === 'group' && option.show">                        
                            <template v-for="(compo,cindex) in option.options">
                                <component v-if="(allowBackInTime || evaluate(compo.if))"
                                    block
                                    dense
                                    flat
                                    :is="compo.type"
                                    :key="cindex"
                                    :loading="compo.loading"
                                    @change="onAction(
                                                pickerConfig.pickerDate,
                                                $event, 
                                                compo.action, 
                                                compo.value, 
                                                getSiblingData(option, compo.needs) || null,
                                                compo.if
                                            )" 
                                >
                                    <v-icon v-if="compo.icon">{{ compo.icon }}</v-icon>
                                    <template slot="default">
                                        {{ $vuetify.t(compo.title) }}
                                    </template>
                                </component>
                            </template>
                        </template>
                        <template v-else-if="option.show" v-for="(compo,cindex) in option.options">
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
                                :key="cindex"
                                :label="$vuetify.t(compo.label)"
                                :loading="compo.loading"
                                :multiple="compo.multiple"
                                :no-data-text="$vuetify.t(compo.label)"
                                :prepend-icon="compo.icon"
                       
                                :single-line=true
                                :small-chips=true
                                style="max-width:220px;"
                                @change="onAction(
                                            pickerConfig.pickerDate,
                                            $event, 
                                            compo.action, 
                                            typeof compo.value === 'boolean' ? !compo.value : compo.value, 
                                            getSiblingData(option, compo.needs) || null,
                                            compo.if
                                        )"
                                
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
                                            <v-chip v-if="index === 0" :small=true>
                                                <span>{{ item.text }}</span>
                                            </v-chip>
                                            <span v-if="index === 1"
                                                class="grey--text caption"
                                            >(+{{ compo.value.length - 1}} others)</span>
                                    </template>
                                </template>
                                <template slot="default">
                                    {{ $vuetify.t(compo.title) }}
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
import FinanceShortcuts from './mixins/DateRangeShortcutsFinance.js'

export default {
    name: 'VDateRangePanel',
    mixins: [FinanceShortcuts],
    data: () => ({
        btnGroup: null
    }),
    props: {
        allowBackInTime: {
            type: Boolean,
            default: true
        },
    }
}
</script>