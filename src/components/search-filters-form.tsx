'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import styles from '@/app/busca/page.module.css'

type SearchFiltersFormProps = {
    keyword: string
    city: string
    segmentName: string
    startDate: string
    endDate: string
}

function buildSearchHref(values: {
    keyword: string
    city: string
    segmentName: string
    startDate: string
    endDate: string
}) {
    const params = new URLSearchParams()

    const normalizedKeyword = values.keyword.trim()
    const normalizedCity = values.city.trim()
    const normalizedSegmentName = values.segmentName.trim()
    const normalizedStartDate = values.startDate.trim()
    const normalizedEndDate = values.endDate.trim()

    if (normalizedKeyword) {
        params.set('keyword', normalizedKeyword)
    }

    if (normalizedCity) {
        params.set('city', normalizedCity)
    }

    if (normalizedSegmentName) {
        params.set('segmentName', normalizedSegmentName)
    }

    if (normalizedStartDate) {
        params.set('startDate', normalizedStartDate)
    }

    if (normalizedEndDate) {
        params.set('endDate', normalizedEndDate)
    }

    params.delete('page')

    const queryString = params.toString()

    return queryString ? `/busca?${queryString}` : '/busca'
}

export default function SearchFiltersForm({
    keyword,
    city,
    segmentName,
    startDate,
    endDate,
}: SearchFiltersFormProps) {
    const router = useRouter()

    const [keywordValue, setKeywordValue] = useState(keyword)
    const [cityValue, setCityValue] = useState(city)
    const [segmentNameValue, setSegmentNameValue] = useState(segmentName)
    const [startDateValue, setStartDateValue] = useState(startDate)
    const [endDateValue, setEndDateValue] = useState(endDate)
    const [isExpanded, setIsExpanded] = useState(
        Boolean(city || segmentName || startDate || endDate)
    )
    const [isSearchInputFocused, setIsSearchInputFocused] = useState(false)

    useEffect(() => {
        setKeywordValue(keyword)
        setCityValue(city)
        setSegmentNameValue(segmentName)
        setStartDateValue(startDate)
        setEndDateValue(endDate)
        setIsExpanded(Boolean(city || segmentName || startDate || endDate))
    }, [keyword, city, segmentName, startDate, endDate])

    const hasActiveFilters = useMemo(() => {
        return Boolean(
            keywordValue.trim() ||
            cityValue.trim() ||
            segmentNameValue.trim() ||
            startDateValue.trim() ||
            endDateValue.trim()
        )
    }, [keywordValue, cityValue, segmentNameValue, startDateValue, endDateValue])

    const hasAdvancedFilters = useMemo(() => {
        return Boolean(
            cityValue.trim() ||
            segmentNameValue.trim() ||
            startDateValue.trim() ||
            endDateValue.trim()
        )
    }, [cityValue, segmentNameValue, startDateValue, endDateValue])

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const nextHref = buildSearchHref({
            keyword: keywordValue,
            city: cityValue,
            segmentName: segmentNameValue,
            startDate: startDateValue,
            endDate: endDateValue,
        })

        router.push(nextHref)
        router.refresh()
    }

    function handleReset() {
        setKeywordValue('')
        setCityValue('')
        setSegmentNameValue('')
        setStartDateValue('')
        setEndDateValue('')
        setIsExpanded(false)
        setIsSearchInputFocused(false)
        router.push('/busca')
        router.refresh()
    }

    return (
        <form onSubmit={handleSubmit} className={styles.searchShell}>
            <div className={styles.searchRow}>
                <div className={`${styles.fieldGroup} ${styles.searchFieldGroup}`}>
                    <label htmlFor="keyword" className={styles.srOnly}>
                        Buscar eventos
                    </label>

                    <input
                        id="keyword"
                        name="keyword"
                        value={keywordValue}
                        onChange={(event) => setKeywordValue(event.target.value)}
                        onFocus={() => setIsSearchInputFocused(true)}
                        onBlur={() => setIsSearchInputFocused(false)}
                        placeholder="Buscar eventos por nome, artista, local..."
                        className={`${styles.input} ${styles.searchInput}`}
                    />
                </div>

                <div className={styles.searchActions}>
                    <button type="submit" className={styles.submitButton}>
                        Buscar
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsExpanded((currentValue) => !currentValue)}
                        className={styles.filterToggleButton}
                    >
                        <span className={styles.filterToggleIcon}>
                            {isExpanded ? '▾' : '▸'}
                        </span>

                        <span>Filtros</span>

                        {hasAdvancedFilters && <span className={styles.filterActiveDot} />}
                    </button>
                </div>
            </div>

            {isSearchInputFocused && (
                <p className={styles.helperText}>
                    Use termos completos para melhorar os resultados da busca.
                </p>
            )}

            {isExpanded && (
                <div className={styles.filtersPanel}>
                    <div className={styles.filtersPanelHeader}>
                        <p className={styles.filtersPanelTitle}>Refine sua busca</p>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className={styles.clearFiltersButton}
                            >
                                Limpar filtros
                            </button>
                        )}
                    </div>

                    <div className={styles.filtersGrid}>
                        <div className={styles.fieldGroup}>
                            <label htmlFor="city" className={styles.label}>
                                Cidade
                            </label>
                            <input
                                id="city"
                                name="city"
                                value={cityValue}
                                onChange={(event) => setCityValue(event.target.value)}
                                placeholder="Ex: Vitória"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label htmlFor="segmentName" className={styles.label}>
                                Categoria
                            </label>
                            <select
                                id="segmentName"
                                name="segmentName"
                                value={segmentNameValue}
                                onChange={(event) => setSegmentNameValue(event.target.value)}
                                className={styles.input}
                            >
                                <option value="">Todas</option>
                                <option value="Music">Música</option>
                                <option value="Sports">Esportes</option>
                                <option value="Arts & Theatre">Artes e teatro</option>
                                <option value="Film">Cinema</option>
                                <option value="Miscellaneous">Outros</option>
                            </select>
                        </div>

                        <div className={styles.fieldGroup}>
                            <label htmlFor="startDate" className={styles.label}>
                                Data início
                            </label>
                            <input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={startDateValue}
                                onChange={(event) => setStartDateValue(event.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label htmlFor="endDate" className={styles.label}>
                                Data fim
                            </label>
                            <input
                                id="endDate"
                                name="endDate"
                                type="date"
                                value={endDateValue}
                                onChange={(event) => setEndDateValue(event.target.value)}
                                className={styles.input}
                            />
                        </div>
                    </div>
                </div>
            )}
        </form>
    )
}
