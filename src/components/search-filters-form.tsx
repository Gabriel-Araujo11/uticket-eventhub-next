'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import styles from '@/app/busca/page.module.css'

type SearchFiltersFormProps = {
    keyword: string
    city: string
    segmentName: string
}

function buildSearchHref(values: {
    keyword: string
    city: string
    segmentName: string
}) {
    const params = new URLSearchParams()

    const normalizedKeyword = values.keyword.trim()
    const normalizedCity = values.city.trim()
    const normalizedSegmentName = values.segmentName.trim()

    if (normalizedKeyword) {
        params.set('keyword', normalizedKeyword)
    }

    if (normalizedCity) {
        params.set('city', normalizedCity)
    }

    if (normalizedSegmentName) {
        params.set('segmentName', normalizedSegmentName)
    }

    const queryString = params.toString()

    return queryString ? `/busca?${queryString}` : '/busca'
}

export default function SearchFiltersForm({
    keyword,
    city,
    segmentName,
}: SearchFiltersFormProps) {
    const router = useRouter()

    const [keywordValue, setKeywordValue] = useState(keyword)
    const [cityValue, setCityValue] = useState(city)
    const [segmentNameValue, setSegmentNameValue] = useState(segmentName)

    useEffect(() => {
        setKeywordValue(keyword)
        setCityValue(city)
        setSegmentNameValue(segmentName)
    }, [keyword, city, segmentName])

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const nextHref = buildSearchHref({
            keyword: keywordValue,
            city: cityValue,
            segmentName: segmentNameValue,
        })

        router.push(nextHref)
    }

    function handleReset() {
        setKeywordValue('')
        setCityValue('')
        setSegmentNameValue('')
        router.push('/busca')
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldGroup}>
                <label htmlFor="keyword" className={styles.label}>
                    Palavra-chave
                </label>
                <input
                    id="keyword"
                    name="keyword"
                    value={keywordValue}
                    onChange={(event) => setKeywordValue(event.target.value)}
                    placeholder="Ex: rock, festival, teatro"
                    className={styles.input}
                />
            </div>

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

            <div className={styles.buttonGroup}>
                <button type="submit" className={styles.submitButton}>
                    Buscar
                </button>

                <button
                    type="button"
                    onClick={handleReset}
                    className={styles.resetButton}
                >
                    Resetar
                </button>
            </div>

            <p className={styles.helperText}>
                Use termos completos para melhorar os resultados da busca.
            </p>
        </form>
    )
}